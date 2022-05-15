<script setup lang="ts">
import { reactive, ref } from "vue";
import { Snackbar } from "@varlet/ui";
import Cookies from "js-cookie";
import publicIp from "public-ip";

const formData = reactive({
  title: "",
  subtitle: "",
  description: "",
  imageSrc: [],
});

const sendMsg = (msg: {
  data: {
    title: string;
    subtitle: string;
    description: string;
    imagesrc: string[];
  };
  ip: string;
  userid: string;
}) => {
  fetch("/api/send", {
    method: "POST",
    body: JSON.stringify(msg),
  }).then((res) => {
    if (res.status == 403) {
      Snackbar.error("You Have Been Banned");
    } else if (res.ok) {
      Snackbar.info("Success");
    } else {
      Snackbar.error("Error");
    }
  });
};

const upload = (uploader: any[], userid: string, ip: string) => {
  let filenames: string[] = [];
  let uploadStatus = 200;

  uploader.forEach((v) => {
    filenames.push(v.file.name)
    fetch("/api/upload", {
      method: "POST",
      body: v.content,
      headers: {
        filename: v.file.name,
        userid: userid,
        ip: ip,
      },
    }).then((resp) => {
      if (!resp.ok || resp.status != 200) {
        if (uploadStatus == 200) {
          uploadStatus = resp.status;
        }
      }
    }).catch((resp) => {
      if (!resp.ok || resp.status != 200) {
        if (uploadStatus == 200) {
          uploadStatus = resp.status;
        }
      }
    });
  });
  if (uploadStatus == 403) {
    Snackbar.error("You Have Been Banned");
    return null;
  } else if (uploadStatus != 200) {
    Snackbar.error("Upload Error");
    return null;
  }

  filenames.forEach((v, i) => {
    filenames[i] = "https://massagewall.blob.core.windows.net/images/" + v;
  });

  return filenames;
};

const onSubmit = async (values: {
  title: string;
  subtitle: string;
  description: string;
  uploader: any;
}) => {
  console.log("submit", values.uploader);

  const userid = Cookies.get("user") as string;
  const ip = await publicIp.v4();

  const filenames = upload(values.uploader, userid, ip);

  sendMsg({
    data: {
      title: values.title,
      subtitle: values.subtitle,
      description: values.description,
      imagesrc: filenames,
    },
    userid: userid,
    ip: ip,
  });
};
</script>

<template>
  <van-form @submit="onSubmit" class="container">
    <van-cell-group inset>
      <van-field
        v-model="formData.title"
        name="title"
        label="标题"
        placeholder="标题"
        :rules="[{ required: false, message: '请填写标题' }]"
      />
      <van-field
        v-model="formData.subtitle"
        name="subtitle"
        label="子标题"
        placeholder="子标题"
        :rules="[{ required: false, message: '请填写子标题' }]"
      />
      <van-field
        v-model="formData.description"
        autosize
        rows="5"
        type="textarea"
        name="description"
        label="简介"
        placeholder="简介"
        :rules="[{ required: false, message: '请填写简介' }]"
      />
      <van-field name="uploader" label="上传图片">
        <template #input>
          <van-uploader multiple v-model="formData.imageSrc" :max-count="4" />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<style scoped>
.container {
  padding-top: 15px;
  padding-bottom: 80px;
}
.uploader {
  padding-top: 18px;
  padding-left: 4%;
  padding-right: 4%;
  width: 100%;
}
</style>
